import React from 'react';

function AddMovie(props) {
    return (
        <div className="container text-white">
            <div className="row">
                <div className="col-lg-8 offset-lg-2">
                <h3 className="mb-3">Add A Movie</h3>
                    <form>
                        <div className="row">
                            <div className="col-md-6 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" for="title">Title</label>
                                    <input type="text" id="title" className="form-control border"/>
                                </div>
                            </div>
                            <div className="col-md-6 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" for="alt-title">Alternative Title</label>
                                    <input type="text" id="alt-title" className="form-control border"/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-8 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" for="thumbnail">Thumbnail URL</label>
                                    <input type="text" id="thumbnail" className="form-control border"/>
                                </div>
                            </div>
                            <div className="col-md-4 mb-1">
                                <div className="form mb-4">
                                    <label className="form-label text-white font-weight-bold" for="year">Year</label>
                                    <input type="text" id="year" className="form-control border"/>
                                </div>
                            </div>
                        </div>
                        <div className="row">

                            <div className="col-md-2 mb-2">
                                <button type="submit" className="btn btn-white btn-block"><i class="fas fa-arrow-circle-left me-1"></i>Back</button>
                            </div>
                            <div className="col-md-10 mb-2">
                                <button type="submit" className="btn btn-danger pbg-accent btn-block"><i class="fas fa-plus-circle me-1"></i>Add</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddMovie;