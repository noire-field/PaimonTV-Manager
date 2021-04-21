import React from 'react';

function AddSection(props) {
    return (
        <div className="container text-white">
            <div className="row">
                <div className="col-lg-6 offset-lg-3">
                    <h3 className="mb-3">Add A Section</h3>
                    <form>
                        <div className="form mb-4">
                            <label className="form-label text-white font-weight-bold" for="auth-email">Section Title</label>
                            <input type="email" id="auth-email" className="form-control border" />
                            
                        </div>
                        <div className="row">
                            <div className="col-md-8 mb-2">
                                <button type="submit" className="btn btn-danger pbg-accent btn-block"><i class="fas fa-plus-circle me-1"></i>Add</button>
                            </div>
                            <div className="col-md-4 mb-2">
                                <button type="submit" className="btn btn-white btn-block"><i class="fas fa-arrow-circle-left me-1"></i>Back</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddSection;